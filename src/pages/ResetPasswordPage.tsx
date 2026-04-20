import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, KeyRound } from 'lucide-react';
import { PasswordStrength, getPasswordStrength } from '@/components/PasswordStrength';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The recovery link puts the user into a special session; if no session present and no recovery hash, send back to login
    const isRecovery = window.location.hash.includes('type=recovery');
    if (!isRecovery && !session) {
      // Give the listener a moment, then redirect
      const t = setTimeout(() => {
        if (!session) navigate('/login');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (getPasswordStrength(password).score < 2) { setError('Please choose a stronger password.'); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    setIsLoading(true);
    const { error: err } = await updatePassword(password);
    setIsLoading(false);
    if (err) { setError(err); return; }
    setSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md border border-border/50 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Set a new password</CardTitle>
          <CardDescription>Choose something secure you'll remember.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-success/10 border-success/30">
              <AlertDescription>Password updated! Redirecting...</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 8 characters" />
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>) : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
