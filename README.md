# local-storage.js

Утилита для хранения и работы с локальными данными

### Методы

- **isSupported()** - Проверяет поддержку localStorage.
- **getInstance(key, [, global])** - Получает все экземпляр данных по ключу.
- **get(key, [, global])** - Получает сохраненные данные по ключу.
- **getCheckTime(key , timeLife)** - Получает данные и проверяет время хранения. timeLife - принимает значения вида '1d' - 1день, '13h' - 13часов, '50m' - 50минут, '10s' - 10секунд. По умолчанию секукды. Если данные хранятся больше указанного срока, то они удаляются и возврящается null.
- **set(key , data)** - Записывает данные по ключу.
- **dump(key)** - Получает все данные в зоне ключа.
- **has(key)** - Проверяет наличие данных по ключу.
- **remove(key)** - Удалят данные по ключу.
- **clear(key)** - Удаляет данные в зоне утилиты.
- **clearAll()** - Удаляет все данные из локального хранилища.

### Важно 
Ключ должен быть вида 'модуль:переменная',
Данные будут записаны в область 'storage:'
Для того чтобы не пересекаться с другими данными.

Например 
```javascript
LocalStorage.set('my-module:variable', {a:1,b:2});
//Данные будут лежать в storage:my-module:variable 

LocalStorage.get('my-module:variable') //=> {a: 1, b: 2}
//Или можно полусить данные из глобальной зоны, передав врорым аргументом true
LocalStorage.get('storage:my-module:variable', true); //=> {a: 1, b: 2}
LocalStorage.get('ключ к любым другим данным', true);

```


### Примеры
```javascript
LocalStorage.set('my-module:variable', {a:1,b:2});

LocalStorage.get('my-module:variable'); //=> {a:1,b:2}
```

```javascript
LocalStorage.set('module:variable', {a:1,b:2});

LocalStorage.getCheckTime('module:variable','12h'); //=> {a:1,b:2} или null в зависимости когда были записаны данные
```