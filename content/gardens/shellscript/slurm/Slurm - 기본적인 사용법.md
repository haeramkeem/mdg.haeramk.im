---
tags:
  - shellscript
  - sh-slurm
date: 2024-09-30
---
## Slurm 클러스터를 사용하기 위한 기본적인 명령어 몇개

### `sinfo`

- `sinfo` 는 Slurm 클러스터 정보를 출력해 준다.

```bash
sinfo
```

![[Pasted image 20240930075824.png]]

### `srun`, `sbatch`

- `srun` 은 job 을 interactive mode 로 실행하고, `sbatch` 는 batch mode (마치 docker 에서 detach mode 처럼?) 로 작동한다.

```bash
srun ${SCRIPT_FILE_OR_COMMAND}
```

![[Pasted image 20240930075901.png]]

```bash
sbatch ${SCRIPT_FILE_OR_COMMAND}
```

### `squeue`

- `squeue` 는 현재 queue 에 있는 job 들의 list 를 보여준다.
	- 마치 `ps` 와 같은 격임

```bash
squeue
```

![[Pasted image 20240930075850.png]]

### `scontrol`

- `scontrol` 은 job 의 자세한 정보를 출력해 준다.

```bash
scontrol ${JOB_ID}
```