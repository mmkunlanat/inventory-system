import './globals.css'

export const metadata = {
  title: 'ระบบช่วยเหลือภัยพิบัติ',
  description: 'ระบบจัดการศูนย์ปฏิบัติการและสินค้าบริจาค',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
