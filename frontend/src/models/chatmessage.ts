export interface ChatMessage {
  userId: number,
  text: string,
  timestamp: {
    epochSecond: number,
    nano: number
  }
}
