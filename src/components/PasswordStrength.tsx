interface Props { password: string }

export function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Very weak', color: 'bg-destructive' },
    { label: 'Weak', color: 'bg-destructive' },
    { label: 'Fair', color: 'bg-accent' },
    { label: 'Good', color: 'bg-accent' },
    { label: 'Strong', color: 'bg-success' },
    { label: 'Excellent', color: 'bg-success' },
  ];
  return { score, ...map[score] };
}

export function PasswordStrength({ password }: Props) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  return (
    <div className="space-y-1">
      <div className="flex gap-1 h-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-colors ${i < score ? color : 'bg-muted'}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Password strength: <span className="font-medium text-foreground">{label}</span></p>
    </div>
  );
}
