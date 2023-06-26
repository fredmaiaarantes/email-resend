/* global Package */

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Resend } from 'resend';
import { getSettings } from 'meteor/quave:settings';

/**
 * Represents the name of the package.
 * @constant {string}
 */
const PACKAGE_NAME = 'f7labs:email-resend';

/**
 * Represents the settings of the package.
 * @type {Object}
 */
const settings = getSettings({packageName: PACKAGE_NAME}) || {};

if (!settings.apiKey && !settings.devMode) {
  /**
   * Throws an error if the API key is missing and not in dev mode.
   * @throws {Meteor.Error}
   */
  throw new Meteor.Error(
    'email-resend: Settings are missing, "apiKey" is required.'
  );
}

/**
 * Creates a new Resend client instance.
 * @param {Object} options - The options for creating the client.
 * @param {string} options.apiKey - The API key for the client.
 * @returns {Resend} The Resend client instance.
 */
export const createResendClient = ({apiKey}) => new Resend(apiKey);

/**
 * Retrieves the Resend client instance.
 * @returns {Resend|Object} The Resend client instance or a mock object in dev mode.
 */
export const getResendClient = () => {
  if (settings.devMode) {
    /**
     * Sends an email using the mock client in dev mode.
     * @param {Object} options - The email options.
     * @param {string} options.To - The recipient's email address.
     * @param {string} options.Subject - The email subject.
     * @param {string} options.HtmlBody - The HTML content of the email.
     * @returns {Promise<void>} A promise that resolves when the email is sent.
     */
    return {
      sendEmail: ({
                    To,
                    Subject,
                    HtmlBody,
                  }) => {
        console.log(PACKAGE_NAME, `${To}:${Subject}`)
        console.log(PACKAGE_NAME, HtmlBody)
        Promise.resolve();
      },
    };
  }
  return new Resend(settings.apiKey);
}

/**
 * Sends an email using the Resend client.
 * @param {Object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.content - The content of the email.
 * @param {string} [options.from] - The sender's email address.
 * @param {Resend} [options.resendClient] - The Resend client instance.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws {Meteor.Error} If the "from" address is not set.
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

  try {
    const response = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      html: content
    });
    console.log(PACKAGE_NAME, { response });
  } catch (error) {
    console.error(PACKAGE_NAME, { error });
  }
};

/**
 * Overrides the custom transport function for sending emails using Resend.
 * @param {Object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} [options.html] - The HTML content of the email.
 * @param {string} [options.text] - The plain text content of the email.
 * @returns {void}
 */
Email.customTransport = options => {
  const {to, subject, html, text} = options;
  const overrideOptions = Email.overrideOptionsBeforeSend
    ? Email.overrideOptionsBeforeSend(options)
    : {};
  sendEmail({
    to,
    subject,
    content: html || text,
    ...overrideOptions,
  })
    .then(() => {
      if (settings.isVerbose) {
        // eslint-disable-next-line no-console
        console.log(`${PACKAGE_NAME}: Email sent to ${to}`);
      }
    })
    .catch(error => {
      console.error(`${PACKAGE_NAME}: Error sending email to ${to}`, error);
    });
};
