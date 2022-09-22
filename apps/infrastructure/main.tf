resource "auth0_client" "shell_ai" {
  name            = "Shell AI"
  description     = "The Shell AI client"
  app_type        = "regular_web"
  is_first_party  = true
  callbacks       = []
  oidc_conformant = true
  grant_types     = ["password", "refresh_token"]

  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_resource_server" "shell_ai_api" {
  name        = "The Shel AI API"
  identifier  = "https://shell-ai-api.vercel.app"
  signing_alg = "RS256"

  allow_offline_access                            = true
  token_lifetime                                  = 8600
  skip_consent_for_verifiable_first_party_clients = true
}
