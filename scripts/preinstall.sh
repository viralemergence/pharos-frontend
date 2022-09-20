echo 'Initialize pharos-documentation submodule';
cd src/pharos-documentation;
git submodule init;
git submodule update;
echo 'Check out publish branch';
git checkout publish;
git pull;
cd ../../;


