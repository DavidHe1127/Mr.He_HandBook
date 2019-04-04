## DynamoDB key points

* [Core Concept](#core-concept)
 * [Primary Key](#primary-key)
 * [Secondary Indexs](#secondary-index)

### core-concept

#### primary-key

* Only key-related attributes need to be defined beforehand. No need put non-key attributes in definition. i.e cloudformation template. 
* Primary Key
  * **Partition key (hash attribute)** - DynamoDB uses the partition key's value as input to an internal hash function. 
                    The output determins the partion in which the item will be stored. It's type must be scalar and can only hold one value - string, number or binary.
  * **Partition key + sort key (range attribute)** - AKA `composite primary key`. Comprised of two attributes - partition key attr + sort key attr.
                               `Partition key` determines where data is stored whereas `sort key` determines sorted order.
                               For tables with composite primary key, partition key can be the same but sort key must be different.

#### secondary-key

* Provide more querying flexibility
* Allow 1 or more SI on a table
* Allow query data using an alternate key in addition to queries against the PK
* 2 types
   * Global SI - An index with a partition key and sort key that can be different from those on the table. Max no. on a table - 20
   * Local SI - An index that has the **same** partition key as the table, but a different sort key. Max no. on a table - 5

![XX](./dynamoDB-2nd-index.jpg)
