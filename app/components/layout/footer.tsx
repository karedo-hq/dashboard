import { Typography } from '../ui/typography';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col">
      <Typography variant="small">© {year} Wizy</Typography>
    </footer>
  );
}
