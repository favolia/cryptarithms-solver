'use client';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

const ToasterProvider = () => {
    const { systemTheme } = useTheme()
    return <Toaster position='bottom-center' closeButton richColors theme={systemTheme} />;
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange defaultTheme="system">
            <ToasterProvider />
            {children}
        </ThemeProvider>
    )
}