---
tags:
  - NVMe
  - NVMeVirt
date: 2024-06-15
---
## 논문을 적어보자

```
\section{Implementation}

\subsection{Existing NVMeVirt Design}

\begin{figure}[h]
    \centering
    \includegraphics[width=\linewidth]{nvmevirt_logical_arch.png}
    \caption{Logical structure of NVMeVirt.}
    \label{fig:nvmevirt_logical_arch}
\end{figure}

The emulation of NVMe devices within the existing NVMeVirt can be categorized into two aspects: functionality and performance. While functionality, internal structure, and performance are tightly coupled in real devices, NVMeVirt decouples functionality to focus on emulating performance. NVMeVirt linearly maps logical block address (LBA) to the physical location inside of the memory to perform actual read and write. As there is no other logic to decide where to locate data, this is beneficial not only in its simplicity, but also in preventing the unpredictability of implementation overheads.

To emulate the performance, NVMeVirt logically implements the internal structure of the NAND flash device. It has multiple channels, logical units (LUNs), planes, blocks, and lines (which are commonly called "Superblock" or "Stripe") represented as C structs. This structure can be changed by adjusting the parameters, except for the number of planes per LUN. The overall logical internal structure is depicted in Figure \ref{fig:nvmevirt_logical_arch}.

\begin{figure}[h]
    \centering
    \includegraphics[width=\linewidth]{nvmevirt_ruh_uw.png}
    \caption{Overview of FDP Flash Translation Layer}
    \label{fig:nvmevirt_ruh_uw}
\end{figure}

Simplified implementation of Flash Translation Layer (FTL) is also included in existing NVMeVirt. Lines are managed with a doubly-linked list and initiated at kernel module load time. The next location to write is managed by a struct called Write Pointer (WP). WP always points to a certain line and is moved to the next free line when the current line is full. As NVMeVirt implements page mapping FTL, LBA is mapped to the physical page address (PPA - which is another logical address, not the physical location of the memory) by the Map Table to calculate the valid page count (VPC) and invalid page count (IPC). For each write, the LBA is converted to the PPA, and IPC for the line is increased when LBA is already mapped to the PPA. The VPC for the line is also increased for each page write and the page write latency is added to the expected finish time. As actual writing to the memory is done before the expected finish time, NVMeVirt waits for the finish time to arrive to emulate the latency for the real device.

Garbage collection (GC) is performed in the foreground when the number of free lines is below the threshold, which is set to 2. Checking for the number of free line is triggered when the write credit is dropped to 0, which is initiated with the number of pages per line and decreased every page writes. The write credit is adjusted to the IPC of the victim line for every GC procedure to trigger GC earlier based on the victim line page utilization history. To select the victim line with the greedy policy, the lines are sorted inside of the doubly-linked list based on the IPC. Moving the valid pages from the victim line to the spare line for the GC process is done logically by increasing the VPC for the spare line. The spare line is referenced by the separate WP, which is called GC WP. When GC is triggered, additional time is added to the expected finish time based on the amount of valid page counts of the victim line. And the victim line is marked as free and the GC procedure ends. No background GC is implemented in NVMeVirt.

\subsection{FDP Integration}

When comparing the logocal internal structure described above with the FDP spec, Reclaim Unit (RU) can be represented as a line and Reclaim Unit Handle (RUH) can be represented as a WP. Thus providing the FDP functionality is achieved by increasing the number of WPs. Modified FTL has an array of WPs and the size of the array is initiated with the number of RUH. A threshold number of free pages for the GC is set to the double of the RUH count as sparing too few free pages results in being unable to perform GC.

FDP specified two modes regarding the isolation degree, the "Initially isolated" and "Permanently isolated" modes. The difference between two modes is whether GC procedure concerns RUH for the victim line: For the "Initially isolated" mode, GC is performed with no RUH concern, and vice versa for the "Permanently isolated" mode. "Initially isolated" mode can be beneficial as it requires no GC procedure changes. However, as the pages for the lines managed with different RUHs can be mixed, the attempt to isolate data based on its hotness using different RUHs will be meaningless over time. And pros and cons are the opposite for the "Permanently isolated" mode: although the GC procedure should be changed to support the mode, it is beneficial as the pages are isolated permanently. The "Permanently isolated" mode can be implemented with making the line manage the additional information for the RUH and mark the spare line with same RUH for the victim line when doing GC. Although its benefits, the proposed research implements only "Initially isolated" mode, which is the only mode referenced FDP SSD is supporting.

As NVMe specifies to use Directive Spec (DSPEC) field in write command to select RUH, the implementation uses the DSPEC value as an index to the WP array. After the WP is selected for the RUH, the corresponding line is used to handle writes, and the line is newly selected when the current line is full in the same manner for the previous implementation. Other mechanisms including the way how GC is performed and calculating the expected finish time remain the same, as in the overview of the changes shown in Figure \ref{fig:nvmevirt_ruh_uw}.

\subsection{Write Amplification Factor (WAF)}

FTL is modified to manage additional field named Units Written to calculate the Write Amplification Factor (WAF). The field points an array of size 2, which accumulates the external writes triggered by the host and the internal writes triggered by the GC process respectively. In the same stage where FTL calculates the expected finish time for each page write, the size of the page is accumulated to the field accordingly with the type of writes (user IO or GC IO).

The total external and internal write sizes are printed to the kernel message when the GC is triggered. While the best practice to retrieve statistics is using the "Data Units Written" log page for the external writes and a "Physical Media Written" log page for the internal writes specified in the S.M.A.R.T log page, the proposed implementation doesn't support these kinds of functionalities.
```

## Notes

- 구현의 간편함, constant performance - 좀더 명확하게 이것이 드러날 수 있도록 용어를 정제해야 함