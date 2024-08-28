

This code below prints jwt token from GH OIDC.

```yml
permissions:
  id-token: write # This is required for requesting the JWT
  contents: read # This is required for actions/checkout

jobs:
  main:
    runs-on: ubuntu-22.04
    steps:
      - name: Request OIDC Token
        id: request-token
        run: |
          echo "Requesting OIDC token..."

          TOKEN=$(curl -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" "$ACTIONS_ID_TOKEN_REQUEST_URL" -H "Accept: application/json; api-version=2.0" -H "Content-Type: application/json" -d "{}" | jq -r '.value')
          jq -R 'split(".") | .[1] | @base64d | fromjson' <<< "$TOKEN"
```
