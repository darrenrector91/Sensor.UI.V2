export class CreateControllerRequest {
  name!: string;
  locationId!: number;
  isActive = true;
  controllerType = '';
  ipAddress: string | null = null;
}
