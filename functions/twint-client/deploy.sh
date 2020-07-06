#
# 必ず crisis-news-mapper/functions/twint-client ディレクトリで実行する
#
cp -r ../data/yuiseki.net/*.json .
gcloud config configurations activate news-mapper

gcloud beta functions deploy twintAccountPubSub --trigger-resource firebase-schedule-crawlMediaFeeds-us-central1 --trigger-event google.pubsub.topic.publish --timeout 540 --project news-mapper-49a5c --runtime python37 --source ./

gcloud beta functions deploy twintDomainPubSub --trigger-resource firebase-schedule-crawlMediaFeeds-us-central1 --trigger-event google.pubsub.topic.publish --timeout 540 --project news-mapper-49a5c --runtime python37 --source ./

gcloud beta functions deploy twintKeywordPubSub --trigger-resource firebase-schedule-crawlMediaFeeds-us-central1 --trigger-event google.pubsub.topic.publish --timeout 540 --project news-mapper-49a5c --runtime python37 --source ./