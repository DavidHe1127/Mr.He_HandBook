## Cryptography

- [HSM](#hardware-security-module)
- [Hashing vs Encrypting](#hashing-vs-encrypting)
- [Symmetirc vs Asymmetric Key](#symmetric-vs-asymmetric-key)

### Hardware Security Module

- Used to store your cryptographic keys and perform cryptographic functions (signing a cert) without requester direct access to the key. Minimising the risk of private key exposures.
- It's like a vending machine. A vending machine stores drinks within an isolated internal environment. It’s designed to accept user inputs (i.e., your item selections) and generate outputs (i.e., pop out a tasty snack), and you can’t access the inside of the vending machine or alter its functions.

### Hashing vs Encrypting

Biggest diff is hashing is one way operation hence irreversible. i.e salt and sha256 (hash function) whilst encrypting is 2 ways.

### Symmetric vs Asymmetric Key

- Asymmetric Key is primarily used to authenticate comms between 2 parties over untrusted network.
- Size limit on encryption data i.e 190 bytes with `RSAES_OASEP_SHA_256` cipher while symmetric key doesn't have such limit.
- RSA is asymmetric key algorithm while AES is symmetric key algorithm.
- RSA lets you download a public key and use it to encrypt data while leaving private key in HSM.
- AES however never lets the key leave HSM, rather you can generate data key through api call which you then use it to encrypt your data.
- kms encrypt command has a 4kb limit on the plaintext input. To encrypt larger data, you need to call generate data key and use it encrypt your text.

### Refs

- [How to use AWS KMS RSA keys for offline encryption](https://aws.amazon.com/blogs/security/how-to-use-aws-kms-rsa-keys-for-offline-encryption/).
