
# Unstoppable Domains Profile API

This example app provides an introductory guideline on how to implement the Unstoppable Domains Profile API management endpoints. It demonstrates posting information to a user-owned domain via Metamask Signature.

**Docs**
Official documentation is available [here](https://docs.unstoppabledomains.com/openapi/profile-v1/)

### Install 
**NPM**
`npm install`

**Yarn**
`yarn install`

## Usage
**Running the Script**
`yarn start`
`npm start`

**Instructions**
- Enter your owned domain or subdomain within the `Domain Name` field. For example,
```
<my_domain>.polygon
```
- Enter your JSON Body within the `Request Body JSON` field. Note that this JSON must be formatted correctly. If implementing this within your own frontend, convert the user input into valid JSON. Example JSON provided below
```json
{
    "displayName": "John Doe",
    "displayNamePublic": true,
    "description": "This is my domain",
    "descriptionPublic": true,
    "location": "Metaverse",
    "locationPublic": true,
    "imagePath": "https://ipfs.io/ipfs/path/to/pfp",
    "imagePathPublic": true,
    "coverPath": "https://ipfs.io/ipfs/path/to/banner",
    "coverPathPublic": true,
    "web2Url": "https://www.mywebsite.com",
    "web2UrlPublic": true,
    "showDomainSuggestion": true,
    "phoneNumber": "555-555-5555",
    "phoneNumberPublic": true,
    "privateEmail": "me@email.com",
    "messagingDisabled": true,
    "thirdPartyMessagingEnabled": true,
    "thirdPartyMessagingConfigType": "Skiff",
    "data": {
      "image": {
        "base64": "aGVsbG8gd29ybGQK",
        "type": "image/png"
      },
      "cover": {
        "base64": "aGVsbG8gd29ybGQK",
        "type": "image/png"
      }
    },
    "socialAccounts": {
      "discord": "discorduser",
      "reddit": "reddituser",
      "twitter": "twitteruser",
      "telegram": "telegramuser",
      "youtube": "youtubeuser"
    }
  }
  ```

  - Click on `Get Message` which will generate the message the end user will be signing. 
  - CLick on `Sign Message` to prompt a Metamask (or other injected wallet) for the domain owner signature
  - Click on `Set Record` to POST the signature and JSON body to the profile API. 

  If replicating on the frontend, merge all three buttons into a single click.
