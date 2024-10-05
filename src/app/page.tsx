import { addDays, startOfToday } from "date-fns";


export default function Home() {
  const days = []
  const today = startOfToday() 
  for (let i = 0; i < 17; i++) {
    days.push(
      addDays(today, i).toISOString()
    )
  }
  return (
    <>
    </>
  );
}
