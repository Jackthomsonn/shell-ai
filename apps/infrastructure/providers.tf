terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 0.34.0"
    }
  }
}

provider "auth0" {}