* [What is SSO and how it works](https://auth0.com/blog/what-is-and-how-does-single-sign-on-work/)
* [keypoints](#keypoints)

### keypoints
* Users will always be redirected to `Auth` server where their sign-in status will be checked.
* In case of unauthenticated visists When they are visiting `abc.domain.com`, `Auth` server will generate a login cookie alongside the redirect url to send back to the client.
* In case of authentication when the same user visits `def.domain.com`, `Auth` server will provide the user with earlier-generated url including login cookie. So, this user does not need to sign in again.

![](./sso_auth0.png)

