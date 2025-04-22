import { Html, Head, Body, Container, Section, Text, Link, Button, Hr, Img } from '@react-email/components';

type ResetPasswordProps = {
  url: string
}
export default function ResetPassword({url}: ResetPasswordProps) {
  const appName = process.env.NEXT_PUBLIC_APPS_NAME || "Cazh POS";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif', paddingRight: '0px', paddingLeft: '0px', color: '#333' }}>
        <Container style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <Section style={{ textAlign: 'center' }}>
            {/* Image Here */}
            <img src='https://cdn1.iconfinder.com/data/icons/heroicons-ui/24/shopping-bag-512.png' width={40} />
            <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3', marginTop: '0px' }}>{appName}</Text>
          </Section>

          <Section style={{ backgroundColor: '#ffffff', padding: '20px', marginBottom: '25px', borderRadius: '8px', textAlign: 'center' }}>
            <Text style={{ fontSize: '17px', fontWeight: 'bold', margin: '0px' }}>Password Reset Request!</Text>
            <Text style={{ fontSize: '14px', marginTop: '0px' }}>
              Seems like you forgot your password for your Cazh-POS account. Click the button below to start resetting your password.
            </Text>

            <Button
              href={url}
              target='_blank'
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                backgroundColor: '#0070f3',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '4px',
                textDecoration: 'none',
                marginTop: '10px',
                marginBottom: '10px'
              }}>
              Reset Password
            </Button>

            <Text style={{ fontSize: '14px', marginTop: '20px' }}>
              If this was a mistake, just ignore this email and nothing will happen.
            </Text>

            <Hr />

            <Section style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '14px', color: '#888', marginBottom: '0px' }}>
                Alternatively, if you are having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
              </Text>
              <Text style={{ fontSize: '14px', color: '#0070f3', marginTop: '10px', marginBottom: '0px' }}>
                <Link href={url} style={{ textDecoration: 'none' }} target='_blank'>
                  {url}
                </Link>
              </Text>
              <Text style={{ fontSize: '13px', color: '#888', lineHeight: '19px', marginBottom: '0px', fontStyle: 'italic' }}>
                For security reasons, This password reset URL will expire in <b>5 minutes</b>.
              </Text>
            </Section>
          </Section>

          <Section style={{ textAlign: 'center', maxWidth: '250px' }}>
            <Text style={{ fontSize: '13px', color: '#888', marginTop: '0px', lineHeight: '19px', marginBottom: '0px' }}>
              By clicking continue, you agree to our <Link href="/terms" style={{ textDecoration: 'none', color: '#0070f3' }}>Terms of Service</Link> and our <Link href="/privacy" style={{ textDecoration: 'none', color: '#0070f3' }}>Privacy Policy</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
