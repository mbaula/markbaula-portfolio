import '../styles/globals.css';

export const metadata = {
    title: {
        template: '%s | Portfolio',
        default: 'Mark Baula – Portfolio'
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body className="antialiased font-body bg-[#0a0a0a] text-neutral-100">
                <main className="min-h-screen bg-noise">{children}</main>
            </body>
        </html>
    );
}
