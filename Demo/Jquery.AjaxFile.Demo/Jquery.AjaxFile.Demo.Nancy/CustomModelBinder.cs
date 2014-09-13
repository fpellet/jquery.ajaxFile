using System;
using System.Linq;
using System.Reflection;
using Nancy;
using Nancy.ModelBinding;

namespace Jquery.AjaxFile.Demo.Nancy
{
    /// <summary>
    /// Sample model binder that manually binds customer models
    /// http://stackoverflow.com/questions/11649385/nancy-model-binding-to-child-class
    /// </summary>
    public class CustomModelBinder : IModelBinder
    {
        public object Bind(NancyContext context, Type modelType, object instance, BindingConfig configuration, params string[] blackList)
        {
            var parentObject = Activator.CreateInstance(modelType);

            foreach (var key in context.Request.Form)
            {
                var value = context.Request.Form[key];
                this.SetObjectValue(parentObject, modelType, key, value);
            }

            return parentObject;
        }

        private void SetObjectValue(object instance, Type type, string key, string propertyValue)
        {
            if (key.Contains("."))
            {
                SetObjectValueDeep(instance, type, key, propertyValue);
            }

            var propertyInfo = type.GetProperty(key, BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public);
            if (propertyInfo == null)
            {
                return;
            }

            propertyInfo.SetValue(instance, Convert.ChangeType(propertyValue, propertyInfo.PropertyType), null);
        }

        private void SetObjectValueDeep(object instance, Type type, string key, string propertyValue)
        {
            var propList = key.Split('.').ToList();

            var propertyInfo = type.GetProperty(propList.First(), BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public);
            if (propertyInfo == null)
            {
                return;
            }

            var childObject = propertyInfo.GetValue(instance, null);

            if (childObject == null)
            {
                childObject = Activator.CreateInstance(propertyInfo.PropertyType);
                propertyInfo.SetValue(instance, childObject, null);
            }

            propList.RemoveAt(0);

            var newKey = propList.Aggregate(string.Empty, (current, prop) => current + (prop + ".")).TrimEnd('.');

            if (newKey.Contains("."))
            {
                SetObjectValueDeep(childObject, childObject.GetType(), newKey, propertyValue);
            }
            else
            {
                SetObjectValue(childObject, childObject.GetType(), newKey, propertyValue);
            }
        }

        public bool CanBind(Type modelType)
        {
            return true;
        }
    }
}