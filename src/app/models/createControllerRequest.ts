export class CreateControllerRequest {
  name!: string;
  location!: string;
  description?: string | null;
  controllerType!: string;
  ipAddress?: string | null;
  deviceIdentifier?: string | null;
  pollIntervalSeconds?: number | null;
  status!: boolean;
  notes?: string | null;
}
