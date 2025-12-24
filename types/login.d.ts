import type { Farmer } from "./farmer";

export interface LoginResponse {
  token: string;
  farmer?: Farmer;
}
