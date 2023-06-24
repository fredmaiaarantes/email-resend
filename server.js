/* global Package */

import {Meteor} from 'meteor/meteor';
import {Email} from 'meteor/email';
import { Resend } from 'resend';
// eslint-disable-next-line import/no-unresolved
import {getSettings} from 'meteor/quave:settings';

const PACKAGE_NAME = 'f7labs:email-resend';
const settings = getSettings({packageName: PACKAGE_NAME}) || {};

if (!settings.apiKey && !settings.devMode) {
  throw new Meteor.Error(
    'email-resend: Settings are missing, "apiKey" is required.'
  );
}

export const createResendClient = ({apiKey}) => new Resend(apiKey);

export const getResendClient = () => {
  if (settings.devMode) {
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

Email.customTransport = options => {
  const {to, subject, html} = options;
  const overrideOptions = Email.overrideOptionsBeforeSend
    ? Email.overrideOptionsBeforeSend(options)
    : {};
  sendEmail({
    to,
    subject,
    content: html,
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
