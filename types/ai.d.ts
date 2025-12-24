export interface AI {
  id: number;
  name: string;
  // API responses may provide either `folder` or `folder_id`
  folder?: number;
  folder_id?: number;
  version?: number;
}
