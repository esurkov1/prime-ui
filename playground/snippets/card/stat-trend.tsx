import { Card } from "@/components/card/Card";

export default function CardStatTrendSnippet() {
  return (
    <Card.Root variant="stat-trend">
      <Card.Label>Выручка (мес.)</Card.Label>
      <Card.Value>₽ 4.2M</Card.Value>
      <Card.Delta trend="up">+18% к прошлому месяцу</Card.Delta>
    </Card.Root>
  );
}
