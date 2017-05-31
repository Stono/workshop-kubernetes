provider "google" {
  credentials = ""
  project      = "potato-169306"
  region       = "europe-west1"
}

resource "google_container_cluster" "cluster" {
  name = "karl"
  zone = "europe-west1-c"
  additional_zones = ["europe-west1-d"]
  monitoring_service = "monitoring.googleapis.com"

  master_auth {
    username = "admin"
    password = "password"
  }

  initial_node_count = 1
  node_version = "1.6.4"
  node_config {
	  machine_type = "n1-standard-2"
	  disk_size_gb = "100"

    oauth_scopes = [
  	  "https://www.googleapis.com/auth/compute",
  	  "https://www.googleapis.com/auth/devstorage.read_write",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring"
    ]
  }
}
