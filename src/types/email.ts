export namespace EmailTemplate {
  export interface Confirmation {
    name: string;
    email: string;
    confirmationUrl: string;
  }

  export interface ResetPassword {
    name: string;
    email: string;
    resetUrl: string;
  }

  export interface Welcome {
    name: string;
    email: string;
  }
}
