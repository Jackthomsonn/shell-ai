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
  name          = "The Shell AI API"
  identifier    = "https://shell-ai-api.vercel.app"
  signing_alg   = "RS256"
  token_dialect = "access_token_authz"

  enforce_policies                                = true
  allow_offline_access                            = true
  token_lifetime                                  = 60
  token_lifetime_for_web                          = 60
  skip_consent_for_verifiable_first_party_clients = true

  scopes {
    value       = "shell:premium"
    description = "Has a premium account"
  }
}

resource "auth0_role" "shell_premium" {
  name        = "Shell Premium"
  description = "Premium subscription"

  permissions {
    resource_server_identifier = auth0_resource_server.shell_ai_api.identifier
    name                       = "shell:premium"
  }
}
