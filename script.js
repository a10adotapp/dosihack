const db = new Dexie("mid_field");

db.version(1).stores({
  users: "++id, dosiMid",
});

window.addEventListener("DOMContentLoaded", async (event) => {
  const dosiMidField = document.querySelector("#dosi-mid-field");
  const dosiMidSubmitButton = document.querySelector("#dosi-mid-submit-button");
  const nftItemList = document.querySelector("#nft-item-list");

  const user = await db.users.toCollection().reverse().first();

  if (user) {
    dosiMidField.value = user.dosiMid;

    fetchData(user.dosiMid);
  }

  dosiMidSubmitButton.addEventListener("click", async (event) => {
    await db.users.put({ dosiMid: dosiMidField.value });

    nftItemList.innerHTML = "";

    fetchData(user.dosiMid);
  });

  async function fetchData(dosiMid) {
    try {
      const gasId = "AKfycbyX5CKzzhMZD1qcPDhPrz9HpOiZyoCDca9MmabXz_6nEfqAQIQgnTH83isEmqjQFB8exA";
      const response = await fetch(`https://script.google.com/macros/s/${gasId}/exec?mid=${dosiMid}`, {
        mode: "cors",
      });

      const responseData = await response.json();

      const fragment = document.createDocumentFragment();

      for (const nftItem of responseData.content[0].nftItems) {
        fragment.appendChild((() => {
          const listItem = document.createElement("li");

          listItem.appendChild((() => {
            const action = document.createElement("a");

            action.href = `https://market.store.dosi.world/ja-JP/nfts/${nftItem.contractId}-${nftItem.tokenType}-${nftItem.tokenIndex}/`;
            action.target = "_blank";
            action.textContent = `[${[
              nftItem.property["\u{d83c}\u{dfa8}\u{30d7}\u{30ec}\u{30b9}\u{72b6}\u{6cc1}"] ?? "",
              nftItem.property["\u{2699}\u{30ae}\u{30a2}\u{30ec}\u{30a2}\u{30ea}\u{30c6}\u{30a3}"] ?? "",
            ].join("")}] ${nftItem.name}`;

            return action;
          })());

          return listItem;
        })());
      }

      nftItemList.appendChild(fragment);
    } catch (err) {
      console.error({ err });
      alert(JSON.stringify(err));
    }
  }
});
