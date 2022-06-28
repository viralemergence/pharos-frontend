git init;
git branch -m prod;
git add -A;
git commit -m "Commit talus-gatsby-starter";
read -p "Github URL for remote origin: " origin;
git remote add origin $origin;
git push -u origin prod;
git checkout -b staging;
git push -u origin staging;
git checkout -b review;
git push -u origin review;
git checkout -b dev;
git push -u origin dev;

