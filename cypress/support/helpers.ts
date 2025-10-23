const DEFAULT_ADULT_TICKET_PRICE = 30;
const DEFAULT_CHILD_TICKET_PRICE = 15;
const DEFAULT_BOOKING_FEE = 0.1;
const EXCHANGE_RATE = 1;

export function calculateTotalPrice(
  adultTickets: number,
  childTickets: number,
  pricePerAdultTicket: number = DEFAULT_ADULT_TICKET_PRICE,
  pricePerChildTicket: number = DEFAULT_CHILD_TICKET_PRICE,
  bookingFee: number = DEFAULT_BOOKING_FEE,
  exchangeRate: number = EXCHANGE_RATE
) {
  const basePrice = adultTickets * pricePerAdultTicket + childTickets * pricePerChildTicket;
  return `€${((basePrice + bookingFee * basePrice) * exchangeRate).toFixed(2)}`;
}
