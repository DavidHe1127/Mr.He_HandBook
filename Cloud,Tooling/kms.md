## KMS

- [Key concepts](#key-concepts)
- [Useful write-ups](#useful-write-ups)

### Key Concepts

#### Customer Master Key
- It's **designed** to encrypt/decrypt data key. That's why there is a 4kb limit on plaintext amount. Use data key if you're intended to encrypt/decrypt application data.
- It's never retrievable in plain-text

#### Data Key

- KMS gives you both plain-text and encrypted key. Encryption is done by a specific CMK - specified in the api call.
- Use Data Key to encrypt/decrypt application data. i.e objects on s3


### Useful write-ups

[how-to-use-aws-kms-securely](https://security.stackexchange.com/questions/146330/how-to-use-aws-kms-securely)
