# redux-listview
HOC for create list page easier

## Data flow

Lot of pages build in SPA are missing the url friendly -- if you don't put informations like page-index and search queries in url, you will lose them after browser refresh.

A url friendly page usually follow data flow like below. And now we extract this pattern to a configurable high order component.

![list-arch](http://oqt8yhdub.bkt.clouddn.com/list-arch.png)
