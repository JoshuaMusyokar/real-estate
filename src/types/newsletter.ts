// ============================================
// NEWSLETTER SUBSCRIBERS
// ============================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  source?: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}
