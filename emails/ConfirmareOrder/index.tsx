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
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface KoalaWelcomeEmailProps {
  userFirstname: string;
  userLastname?: string;
  strada?: string;
  numar?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  apartament?: string;
  localitate?: string;
  judet?: string;
  codPostal?: string;
  orderNumber?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const EmailConfirmareOrder = ({
  userFirstname,
  userLastname,
  strada,
  numar,
  bloc,
  scara,
  etaj,
  apartament,
  localitate,
  judet,
  codPostal,
  orderNumber,
}: KoalaWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>
    <Body style={main}>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
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
          <Text style={paragraph}>
            Te rugăm să verifici dacă adresa este corectă și completă, de
            exemplu dacă ai precizat numărul străzii, deoarece aceasta nu poate
            fi schimbată după expedierea comenzii.
          </Text>

          <div style={expediere}>
            <Img
              src="https://lolelaboutique.ro/locatie.png"
              width="28"
              height="28"
            />
            <Text style={expediereParagraph}>Expediere către:</Text>
          </div>
          <Section>
            <div style={stradaAdresa}>
              {strada} {numar}
            </div>
            <div style={flex}>
              {bloc && <div style={localitateAdresa}>Bloc: {bloc}</div>}
              {scara && <div style={localitateAdresa}>Scara: {scara}</div>}
              {etaj && <div style={localitateAdresa}>Etaj: {etaj}</div>}
              {apartament && <div style={localitateAdresa}>Apartament: {apartament}</div>}
            </div>

            <Row>
              <div style={flex}>
                <div style={localitateAdresa}>{localitate}</div>
                <div style={localitateAdresa}>{judet}</div>
                <div style={localitateAdresa}>{codPostal}</div>
              </div>
            </Row>
          </Section>
          <Hr />
          <Text style={paragraph}>
            Best,
            <br />
            The <strong>LolelaBoutique</strong> team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            COJOCARU T. V. IONELA PFA {orderNumber}, Bucuresti, 010017
          </Text>
        </Container>
      </Tailwind>
    </Body>
  </Html>
);

EmailConfirmareOrder.PreviewProps = {
  userFirstname: "Cojocaru",
  userLastname: "Theodor",
  strada: "Libertatii",
  numar: "1",
  localitate: "Adjud",
  judet: "Vrancea",
  codPostal: "6100",
  orderNumber: 10023,
  bloc: "13",
  scara: "2",
  etaj: "4",
  apartament: "49"
} as KoalaWelcomeEmailProps;

export default EmailConfirmareOrder;

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

const localitateAdresa = {
  border: "1px solid #da8fc2",
  width: "fit-content",
  padding: "5px 10px",
  borderRadius: "5px",
  fontSize: "24px",
  marginBottom: "20px",
  backgroundColor: "#fff0fa",
};

const paragraph = {
  fontSize: "20px",
  lineHeight: "30px",
};

const flex = {
  display: "flex",
  alignItems: "center" as const,
  gap: "8px" as const,
};

const stradaAdresa = {
  border: "1px solid #da8fc2",
  display: "block",
  width: "fit-content",
  padding: "5px 10px",
  fontSize: "24px",
  backgroundColor: "#da8fc2",
  color: "#fff",
  borderRadius: "5px",
  marginBottom: "15px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const expediere = {
  display: "flex",
  alignItems: "center" as const,
  gap: "8px" as const,
};

const expediereParagraph = {
  fontSize: "20px",
  fontWeight: "bold",
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
