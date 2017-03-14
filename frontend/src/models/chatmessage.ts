export interface ChatMessage {
  text: string,
  timestamp: {
    epochSecond: number,
    nano: number
  }
}