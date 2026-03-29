export type ClaimEmailState = { username: string };
export type ClaimCodeState = { username: string; email: string };
export type ClaimSuccessState = { username: string };
export type ClaimErrorState = {
  username: string;
  variant: 'taken' | 'other';
  message: string;
};
