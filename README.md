# Resend Client Email

`f7labs:email-resend` is a package that simplifies the process of sending emails using Meteor. It provides a plug-and-play integration with [Resend](https://resend.com/), leveraging the powerful email package from Meteor.

## Installation
To install `f7labs:email-resend`, simply execute the following command:

```sh
meteor add f7labs:email-resend
```

## Usage

### Resend

Create a [Resend](https://resend.com/docs/introduction) account, create an API Key and verify your domain.


### Configuration

To get started quickly with using Resend as the email provider for Meteor, you only need to configure your API Key in your settings. Modify your settings file as follows:

```json
{
  "packages": {
    "f7labs:email-resend": {
      "from": "noreply@yourdomain.com",
      "apiKey": "re_aAAaAAAA_0a0AaAAaAaAaaaaaAa0AaAAA"
    }
  }
}
```

Alternatively, if you prefer to set the `from` field dynamically, you can do so by either configuring it in the settings or by passing it as a prop when calling the email manually.

### Code usage

You can also use this package to send emails directly. Here's an example of how to do it:

```javascript
import { sendEmail } from 'meteor/f7labs:email-resend';

Meteor.methods({
  sendReminderEmail({ to, subject, content }) {
    sendEmail({
      to,
      subject,
      content,
    })
      .then(() => {
        console.log(`Email sent to ${to}`);
      })
      .catch(error => {
        console.error(`Error sending email to ${to}`, error);
      });
  }
});
```

You can optionally provide the `from` field in the `sendEmail` function if you haven't set it in the package settings.

### Limitations
Please note that the Meteor `email` package needs to be in version 2.2 or above, which corresponds to Meteor version `2.4`.

### License

This project is licensed under the MIT license.

