import {colors} from "../../theme";
import {Box, Container} from "@mui/material";
import {CustomBreadcrumbs, Input} from "../../components/common";

export default function LoginPage() {
    return(
            <Box sx={{ minHeight: '100vh', backgroundColor: colors.secondaryDark, paddingTop: '80px' }}>
                <Container maxWidth="lg" sx={{ paddingY: 4 }}>
                    {/* Breadcrumbs */}
                    <CustomBreadcrumbs
                        items={[
                            { label: 'Accueil', path: '/' },
                            { label: 'Se connecter'},
                        ]}
                    />
                    {/* Formulaire de connexion*/}
                    <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (touched.email) {
                                    setEmailError(validateEmail(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, email: true });
                                setEmailError(validateEmail(email));
                            }}
                            error={touched.email && !!emailError}
                            helperText={touched.email ? emailError : ''}
                            required
                        />
                        <Input
                            label="Mot de passe"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (touched.phone) {
                                    setPhoneError(validatePhone(e.target.value));
                                }
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, phone: true });
                                setPhoneError(validatePhone(phone));
                            }}
                            error={touched.phone && !!phoneError}
                            helperText={touched.phone ? phoneError : ''}
                            required
                        />
                    </Box>
                </Container>
            </Box>
    )
}