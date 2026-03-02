import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Resend } from 'resend';

const getSettings = ({ packageName }) => ({
  ...(Meteor.settings?.packages?.[packageName] || {}),
  ...(Meteor.settings?.public?.packages?.[packageName] || {}),
});

const PACKAGE_NAME = 'fredericomaia:email-resend';

const settings = getSettings({packageName: PACKAGE_NAME});

if (!settings.apiKey && !settings.devMode) {
  throw new Meteor.Error(
    'email-resend: Settings are missing, "apiKey" is required.'
  );
}

/**
 * Returns the Resend client. In dev mode, returns a mock that logs emails to
 * the console instead of sending them.
 * @returns {{ emails: { send: Function } }}
 */
export const getResendClient = () => {
  if (settings.devMode) {
    return {
      emails: {
        send: async ({ from, to, subject, html }) => {
          console.log(`${PACKAGE_NAME} [devMode] ${from} -> ${to}: ${subject}`);
          console.log(PACKAGE_NAME, html);
        },
      },
    };
  }
  return new Resend(settings.apiKey);
}

/**
 * Sends an email via Resend.
 * @param {Object} options
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.content - HTML content of the email.
 * @param {string} [options.from] - Sender address. Falls back to the `from` setting.
 * @param {{ emails: { send: Function } }} [options.resendClient] - Override the Resend client.
 * @returns {Promise<void>}
 * @throws {Meteor.Error} If no `from` address is set.
 */
export const sendEmail = async ({
                                  to,
                                  subject,
                                  content,
                                  from: fromParam,
                                  resendClient: clientParam
                                }) => {
  const resend = clientParam || getResendClient();
  const from = fromParam || settings.from;
  if (!from) {
    throw new Meteor.Error(
      `${PACKAGE_NAME}: set a global "from" address in the package settings or add it to every email call you make.`
    );
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: content,
  });
  if (error) {
    throw new Meteor.Error(`${PACKAGE_NAME}: ${error.message}`);
  }
  console.log(PACKAGE_NAME, { data });
};

/**
 * Meteor custom email transport. Invoked automatically by the `email` package
 * for all outgoing emails, including Accounts password flows. Respects
 * `Email.overrideOptionsBeforeSend` for per-send overrides.
 */
Email.customTransport = async options => {
  const {to, subject, html, text} = options;
  const overrideOptions = Email.overrideOptionsBeforeSend
    ? Email.overrideOptionsBeforeSend(options)
    : {};
  await sendEmail({
    to,
    subject,
    content: html || text,
    ...overrideOptions,
  });
  if (settings.isVerbose) {
    console.log(`${PACKAGE_NAME}: Email sent to ${to}`);
  }
};
