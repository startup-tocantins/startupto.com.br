rails g scaffold startup name:string description:text logo:string category:string stage:string country:string state:string city:string site:string contact:string latitude:string longitude:string group:string fundation:date
rails g scaffold link kind:string url:string description:text startup:references
rails g scaffold member name:string email:string linkedin:string role:string
rails g model startup_member startup:references member:references


rails d scaffold startup
rails d scaffold link
rails d scaffold member
rails d model team_member
