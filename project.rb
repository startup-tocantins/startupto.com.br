rails g scaffold startup name description:text logo category stage country state city site contact latitude longitude group fundation:date
rails g scaffold link kind url description:text startup:references
rails g scaffold member nome email linkedin role
rails g model startup_member startup:references member:references


rails d scaffold startup
rails d scaffold link
rails d scaffold member
rails d model team_member
