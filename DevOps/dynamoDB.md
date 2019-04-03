## DynamoDB key points

* [Core Concept](#core-concept)


### core-concept

* Secondary Index - provide more querying flexibility
* Only key-related attributes need to be defined beforehand. No need put non-key attributes in definition. i.e cloudformation template. 
* Primary Key
  * **Partition key (hash attribute)** - DynamoDB uses the partition key's value as input to an internal hash function. 
                    The output determins the partion in which the item will be stored. It's type must be scalar and can only hold one value - string, number or binary.
  * **Partition key + sort key (range attribute)** - AKA `composite primary key`. Comprised of two attributes - partition key attr + sort key attr.
                               `Partition key` determines where data is stored whereas `sort key` determines sorted order.
                               For tables with composite primary key, partition key can be the same but sort key must be different.
                    

