## Storage

- [Basics](#types)
- [Storage Redundancy](#storage-redundancy)
- [Moving Data](#moving-data)

- Storage Account = Unique Azure namespace
- Every object in Azure has its own web address. i.e Given a storage account called acloudguru, for blob storage, you'd have `acloudguru.blob.core.windows.net`.
- Storage account has blob containers inside it for you to store blob data in.
- A container name must be a valid DNS name, as it forms part of the unique URI 

![Storage account/container/Blob](https://learn.microsoft.com/en-us/azure/storage/blobs/media/storage-blobs-introduction/blob1.png)

### types

- blob (S3), Disk (EBS), File (EFS)
- File storage use case: your on-premise file system runs out of space and you want to extend it. Or completely replace on-prem file system with it.
- Archive storage is blob storage, so the same tools will work for both.

### Storage Redundancy

- minimum of 3 copies. Can be 6 when opting for Multi-Region redundancy - 3 in primary and 3 in secondary region.
- automatic
- Invisible to users
- The higher redundancy option, the higher cost

#### Locally Redundant Storage (LRS) - Single Region

- all 3 copies are kept in the same data centre in one az
- lowest cost
- protect against single disk failure
- doesn't protect against zone or regional outage

#### Zone-Redudant Storage (ZRS) - Single Region

- 3 copies span 3 AZs
- Protect against zone outage but not regional outage

#### Geo-Redudant Storage (GRS) - Multi-Region

- 3 copies in primary region but in a single AZ. 3 copies in secondary/paired region in a single AZ too. LRS within each region.
- Protect against primary region failure but no zonal redundancy within the primary region.
- Can configure read access from secondary region for high availability.

#### Geo-Zone-Redudant Storage (GZRS) - Multi-Region

- 3 copies in primary region but span 3 AZs in that region
- 3 copies in secondary/paired region but ONLY in a single AZ
- Protect against primary region failure AND primary region zone failure
- Can configure read access from secondary region for high availability.

### Moving Data

- AZCopy
- Azure Storage Explorer
- Azure File Sync

#### AZCopy

- CLI. A nice fit for automation
- Can only move Blob and Azure Files

#### Storage Explorer

- GUI
- Support all storage account formats

#### Azure File Sync

- automatic sync from on-premise file server to Azure
- Transition to only Azure Files for file server

#### Azure Data Box 

- AWS Snowball equivalent
- Transfer LOTS OF data into/out of Azure storage with limited internet bandwidth
- Offline method

#### Azure Migrate

- Transfer Servers/Databases/Applications to Azure
- A suite of tools to help with migration

### Premium Perf Options

Needed for low-latency requirements

Key points

- Available storage types for each perf option
- Redundancy options - trade more perf for less redundancy

#### Premium block blobs

- Ideal for low-latency blob storage workload applications - AI/IoT
- Only supports LRS/ZRS

#### Premium page blobs

- unmanaged virtual disk (IaaS)
- Only supports LRS

#### Premium file shares

- Support Azure files
- High-perf enterprise (file server) applications
- Only support LRS/ZRS