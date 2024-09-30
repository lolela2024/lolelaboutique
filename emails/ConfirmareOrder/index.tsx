import {
  Body,
  Button,
  Container,
  Column,
  Row,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface KoalaWelcomeEmailProps {
  userFirstname: string;
  userLastname?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const KoalaWelcomeEmail = ({
  userFirstname,
  userLastname,
}: KoalaWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Row>
          <div style={row}>
            <Img
              src={`https://lolelaboutique.ro/cropped-logooo8.png`}
              width="200"
              height="65"
              alt="LolelaBoutique"
            />

            <span style={confirm}>Comandă Confirmată</span>
          </div>
        </Row>
        <Hr />
        <Text style={paragraph}>
          Bună {userFirstname} {userLastname},
        </Text>
        <Text style={paragraph}>
          Comanda ta este confirmată! Pregătim comanda ta pentru livrare și te
          vom anunța când este expediată.
        </Text>
        <Text style={paragraph} >
          Te rugăm să verifici dacă adresa este corectă și completă, de exemplu
          dacă ai precizat numărul străzii, deoarece aceasta nu poate fi
          schimbată după expedierea comenzii.
        </Text>

        <div>
          <Img src=""  width="28" height="28" />
          <Text>Expediere către:</Text>
        </div>
        <Section style={btnContainer}>
          <Button style={button} href="https://getkoala.com">
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Koala team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          470 Noor Ave STE B #1148, South San Francisco, CA 94080
        </Text>
      </Container>
    </Body>
  </Html>
);

KoalaWelcomeEmail.PreviewProps = {
  userFirstname: "Alan",
} as KoalaWelcomeEmailProps;

export default KoalaWelcomeEmail;

const confirm = {
  color: "#929292",
  fontSize: "24px",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "20px",
  lineHeight: "30px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

const row = {
  alignItems: "flex-start",
  display: "flex",
  justifyContent: "space-between",
};
