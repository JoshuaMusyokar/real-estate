// ============================================
// AUTOMATION WORKFLOWS
// ============================================

export type WorkflowTrigger =
  | "FORM_SUBMISSION"
  | "LEAD_CREATED"
  | "LEAD_STAGE_CHANGED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_COMPLETED"
  | "PROPERTY_INQUIRY"
  | "NO_RESPONSE_TIMEOUT"
  | "LEAD_INACTIVE";

export type WorkflowActionType =
  | "SEND_EMAIL"
  | "SEND_WHATSAPP"
  | "SEND_SMS"
  | "CREATE_TASK"
  | "UPDATE_LEAD_STAGE"
  | "ASSIGN_LEAD"
  | "ADD_TAG"
  | "WAIT_DELAY";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  actions: WorkflowAction[];
  executions: WorkflowExecution[];
}

export interface WorkflowAction {
  id: string;
  workflowId: string;
  order: number;
  actionType: WorkflowActionType;
  config: any;
  delayMinutes?: number;
  createdAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  leadId?: string;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  errorLog?: string;
}
