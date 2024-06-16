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


\subsection{Integrating FDP into NVMeVirt}
Implementing FDP in NVMeVirt involved modifying the \texttt{conv\_ftl.c} file to handle the \texttt{cmd->rw.control} and \texttt{cmd->rw.dsmgmt} fields for FDP-specific commands. The integration allows dynamic assignment of placement handles and efficient management of write operations. This section will detail the technical steps taken to achieve this implementation.

\subsection{Write Amplification Factor (WAF)}
WAF is a critical metric in evaluating SSD performance. It is defined as the ratio of the amount of data written to the NAND flash memory to the amount of data written by the host. Lowering WAF is essential for improving SSD endurance and performance. We adapted NVMeVirt to measure WAF accurately under different FDP configurations.
```

## Implementation

### Existing NVMeVirt Design

Emulating NVMe devices in existing NVMeVirt can be categorized into two ways: Functionality and performance. While functionality, internal structure, and performance are tightly coupled in real devices, NVMeVirt decouples functionality to focus on emulating performance. NVMeVirt linearly maps logical block address (LBA) to the physical location inside of the memory to perform actual read and write. As there is no other logic to decide where to locate data, this is beneficial not only in its simplicity, but also in preventing the unpredictability of implementation overheads [^linear-mapping-benefit].
To emulate the write performance, NVMeVirt logically implements the internal structure of the NAND flash device. It has multiple channels, logical units (LUNs), planes, blocks, and lines (which are commonly called "Superblock" or "Stripe") represented as numbers and C structs. These structures can be changed by adjusting the parameters, except for the number of planes per LUN. The overall logical structure is depicted in Figure ##.
Simplified implementation of Flash Translation Layer (FTL) is also included in existing NVMeVirt. Lines are managed with a doubly-linked list and initiated at kernel module load time. The next location to write is managed with a Write pointer (WP), and the write pointer always points to a certain line and is moved to the next free line when the current line is full. LBA is mapped to the PPN (which is another logical address, not the physical location of the memory) by the map table to calculate the valid and invalid page count. For each write, the LBA is converted to the PPN, and the number of invalid page counts for the line is increased when LBA is already mapped to the PPN. The valid page count for the line is also increased for the page write and the page write latency is added to the expected finish time. As the actual write is done before the expected finish time, NVMeVirt waits for the finish time to arrive to emulate the latency for the real device.
Garbage collection (GC) is performed in foreground when the number of free lines is below the threshold, which is set to 2. Each line is sorted inside of the doubly-linked list based on the invalid page counts. Victim for the GC is selected with greedy policy, that is selecting a line having the highest invalid page count as a victim line. Moving the valid pages inside of the victim line is done with increasing the valid page for the line. The WP for the GC is separated from the WP for write to point spare line for the GC. Thus there is another WP, called gc_wp, inside of the FTL. When GC is triggered, additional time is added to the expected finish time based on the valid page counts of the victim line. No background GC is implemented in NVMeVirt.

### Flexible Data Placement

Reclaim Unit (RU) is represented as a line and Reclaim Unit Handle (RUH) is represented as a WP. Thus providing the FDP functionality is achieved by increasing the number of WP. FTL now has an array of WP and the size is configured value of the number of RUH. The number of GC WP remains 1 as the referenced Samsung FDP SSD only supports "initially isolated" mode. By maintaining the additional RUH information for the line "permanently isolated" mode can be implemented, but the current implementation doesn't support the feature.
Selecting WP is done by the "DSPEC" value inside of the NVMe write command. Using the DSPEC value as an index to the WP array, the corresponding line is used to handle writes, and the line is newly selected when the current line is full in the same manner for the existing implementation. Other mechanisms including the way how GC is performed and calculating the expected finish time remain the same, as in the overview of the changes shown in Figure ##.

### Write Amplification Factor

To calculate Write Amplification Factor (WAF), 

---
[^linear-mapping-benefit]: 구현의 간편함, constant performance - 좀더 명확하게 이것이 드러날 수 있도록 용어를 정제해야 함