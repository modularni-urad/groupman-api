# groupman-api

Slouží pro správu uživatelských skupin a příslušnosti v nich.

## SETTINGS

Pouze pomocí ENVIRONMENT VARIABLES, jsou samovysvětlující:
- PORT=3000 (default 3000)
- HOST=0.0.0.0 (default localhost)
- DATABASE_URL=postgres://username:secret@localhost:5432/moje_db
- REDIS_URL=redis://redis:6379
- SESSION_SECRET=secretProZabezpeceniSession

[Dockerfile](Dockerfile) umožňuje nasadit jako kontejner,
idealně pomocí orchestrátoru jako např. [kubernetes](https://kubernetes.io/).

### Develop with minikube

```
eval $(minikube -p minikube docker-env)
docker build . -f dev/Dockerfile -t modularni-urad/groupman
kubectl apply -f dev/pod.yaml
```

Při redeployi nezapomeň smazat existující pod:
```
kubectl delete pod groupman
```