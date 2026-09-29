import 'react';

/**
 * The Invoker Commands API's two attributes on a button, which open and close a project view's
 * enlarged picture without script, per ADR-018. React renders lowercase attributes it does not know
 * as they are written, so only its types need telling: `@types/react` 19.3 carries `closedby` on
 * a dialog but not these two.
 */
declare module 'react' {
  // A declaration merge repeats the interface's type parameter, which these two do not use.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    /** The id of the element the button's command acts on. */
    commandfor?: string;
    /**
     * What the button does to it: a dialog's are `show-modal`, `close` and `request-close`. A
     * command that starts with two dashes is the page's own: the browser does nothing with it but
     * tell the element, as a gallery's larger picture is told to show itself in place, per ADR-019.
     */
    command?: 'show-modal' | 'close' | 'request-close' | `--${string}`;
  }
}
