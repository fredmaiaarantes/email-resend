# Resend Client Email

`fredericomaia:email-resend` is a package that simplifies the process of sending emails using Meteor. It provides a plug-and-play integration with [Resend](https://resend.com/), leveraging the powerful email package from Meteor.

## Installation
To install `fredericomaia:email-resend`, simply execute the following command:

```sh
meteor add fredericomaia:email-resend
```

## Usage

### Resend

Create a [Resend](https://resend.com/docs/introduction) account, create an API Key and verify your domain.


### Configuration

To get started quickly with using Resend as the email provider for Meteor, you only need to configure your API Key in your settings. Modify your settings file as follows:

```json
{
  "packages": {
    "fredericomaia:email-resend": {
      "from": "noreply@yourdomain.com",
      "apiKey": "re_aAAaAAAA_0a0AaAAaAaAaaaaaAa0AaAAA"
    }
  }
}
```

| Setting | Required | Description |
|---------|----------|-------------|
| `apiKey` | Yes (unless `devMode`) | Your Resend API key |
| `from` | No | Default sender address. Can be overridden per call. |
| `devMode` | No | When `true`, emails are logged to the console instead of sent. `apiKey` is not required. |
| `isVerbose` | No | When `true`, logs a success message after each email sent via `Email.customTransport`. |

### Usage

Automatically used when calling methods from the `Email` and `Accounts Password` packages. For example when calling Accounts functions as `Accounts.sendVerificationEmail()`, `Accounts.forgotPassword()`, `Accounts.sendResetPasswordEmail()`, and so on.

You can also use this package to send emails directly. Here's an example of how to do it:

```javascript
import { Meteor } from 'meteor/meteor';
import { sendEmail } from 'meteor/fredericomaia:email-resend';

Meteor.methods({
  async sendMyRandomEmail({ to, subject, content }) {
    try {
      await sendEmail({ to, subject, content });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Error sending email to ${to}`, error);
    }
  }
});
```

You can optionally provide the `from` field in the `sendEmail` function if you haven't set it in the package settings.

### Limitations
Requires Meteor 3.0 or above.

### License

This project is licensed under the MIT license.

