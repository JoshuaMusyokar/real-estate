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

export interface WorkflowActionInput {
  order: number;
  actionType: WorkflowActionType;
  config: Record<string, string | number>;
  delayMinutes?: number;
}
export interface CreateWorkflowInput {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions?: Record<string, string | number>;
  isActive?: boolean;
  actions: WorkflowActionInput[];
}
export interface UpdateWorkflowInput {
  name?: string;
  description?: string;
  trigger?: WorkflowTrigger;
  conditions?: Record<string, string | number>;
  isActive?: boolean;
  actions?: WorkflowActionInput[];
}
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions?: Record<string, string | number>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  actions: WorkflowAction[];
  executions: WorkflowExecution[];
}
export interface WorkflowResponse {
  id: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  conditions?: Record<string, string | number>;
  isActive: boolean;
  actions: WorkflowActionResponse[];
  executions: WorkflowExecutionResponse[];
  createdAt: Date;
  updatedAt: Date;
}
export interface WorkflowActionResponse {
  id: string;
  order: number;
  actionType: WorkflowActionType;
  config: Record<string, string | number>;
  delayMinutes?: number;
}
export interface WorkflowFilter {
  trigger?: WorkflowTrigger;
  isActive?: boolean;
}
export interface WorkflowExecutionResponse {
  id: string;
  status: string;
  leadId?: string;
  startedAt: Date;
  completedAt?: Date;
  errorLog?: string;
}
export interface WorkflowAction {
  id: string;
  workflowId: string;
  order: number;
  actionType: WorkflowActionType;
  config: Record<string, string | number>;
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

export interface WorkflowCreateRequest {
  name: string;
  description?: string;
  trigger: string;
  conditions?: Record<string, string | number>;
  isActive?: boolean;
  actions: WorkflowActionRequest[];
}

export interface WorkflowActionRequest {
  order: number;
  actionType: string;
  config: Record<string, string | number>;
  delayMinutes?: number;
}

export interface WorkflowUpdateRequest {
  name?: string;
  description?: string;
  trigger?: string;
  conditions?: Record<string, string | number>;
  isActive?: boolean;
  actions?: WorkflowActionRequest[];
}

export interface ExecuteWorkflowRequest {
  leadId?: string;
  context?: Record<string, string | number>;
}
export interface WorkflowsResponse {
  data: WorkflowResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
